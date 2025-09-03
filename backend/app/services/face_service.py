import cv2
import numpy as np
import mediapipe as mp
from typing import Optional

# Initialize MediaPipe Face Mesh solution.
# We create this instance once when the module is loaded
# to avoid re-initializing it on every API call, which is inefficient.
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(
    static_image_mode=True, 
    max_num_faces=1, 
    min_detection_confidence=0.5
)

def get_face_embedding(image_bytes: bytes) -> Optional[np.ndarray]:
    """
    Takes image data in bytes, detects a face, and generates a simple embedding.

    The "embedding" is a unique numerical signature of the face, created by
    flattening the 3D coordinates of all 468 facial landmarks detected by MediaPipe.

    Args:
        image_bytes: The image file as bytes.

    Returns:
        A NumPy array representing the face embedding, or None if no face is found.
    """
    try:
        # Decode the image bytes into a NumPy array that OpenCV can use.
        nparr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Convert the BGR image to RGB, as MediaPipe expects RGB.
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        # Process the image to find face landmarks.
        results = face_mesh.process(image_rgb)

        # If no face landmarks are found, return None.
        if not results.multi_face_landmarks:
            return None

        # Extract the landmarks from the first detected face.
        landmarks = results.multi_face_landmarks[0].landmark
        
        # Create a NumPy array of all landmark coordinates (x, y, z) and
        # flatten it into a single one-dimensional vector. This is our embedding.
        embedding = np.array([[lm.x, lm.y, lm.z] for lm in landmarks]).flatten()
        
        return embedding
    except Exception as e:
        # Log any errors that occur during processing.
        print(f"Error in face embedding generation: {e}")
        return None

def compare_faces(stored_embedding_str: str, new_embedding: np.ndarray) -> float:
    """
    Compares two face embeddings by calculating the Euclidean distance between them.

    Args:
        stored_embedding_str: The face embedding stored in the database (as a comma-separated string).
        new_embedding: The newly generated face embedding from the login attempt (as a NumPy array).

    Returns:
        The calculated distance (a float). A smaller number signifies a closer match.
    """
    # Convert the stored embedding string back into a NumPy array of floats.
    stored_embedding = np.array([float(x) for x in stored_embedding_str.split(',')])
    
    # Calculate the Euclidean distance between the two vectors.
    # This is a standard way to measure the similarity between two points in space.
    distance = np.linalg.norm(stored_embedding - new_embedding)
    
    return distance