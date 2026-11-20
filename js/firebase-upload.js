/**
 * Firebase Upload Module - Prabhat Maharjan Studio
 * Handles audio file and image uploads to Firebase Storage.
 * Falls back gracefully if Firebase is not configured.
 */

let firebaseApp = null;
let firebaseStorage = null;

async function initFirebase() {
  if (!window.FIREBASE_READY || firebaseApp) return firebaseApp;
  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    const { getStorage } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js');
    firebaseApp = initializeApp(FIREBASE_CONFIG);
    firebaseStorage = getStorage(firebaseApp);
    console.log('✅ Firebase Storage initialized');
    return firebaseApp;
  } catch (err) {
    console.warn('Firebase init failed:', err);
    return null;
  }
}

/**
 * Upload an audio file to Firebase Storage
 * @param {File} file - The audio file (MP3/WAV/OGG)
 * @param {string} trackId - Unique track ID for filename
 * @param {function} onProgress - Progress callback (0-100)
 * @returns {Promise<string>} - Download URL
 */
window.uploadAudioToFirebase = async function(file, trackId, onProgress = () => {}) {
  if (!window.FIREBASE_READY) {
    throw new Error('Firebase not configured. Please fill in js/firebase-config.js');
  }

  await initFirebase();
  if (!firebaseStorage) throw new Error('Firebase Storage not available');

  const { ref, uploadBytesResumable, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js');

  const ext = file.name.split('.').pop().toLowerCase();
  const fileName = `tracks/${trackId}_${Date.now()}.${ext}`;
  const storageRef = ref(firebaseStorage, fileName);

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file, {
      contentType: file.type || 'audio/mpeg'
    });

    uploadTask.on('state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        onProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      }
    );
  });
};

/**
 * Upload a cover image to Firebase Storage
 * @param {File} file - Image file
 * @param {string} trackId - Unique ID
 * @returns {Promise<string>} - Download URL
 */
window.uploadCoverToFirebase = async function(file, trackId) {
  if (!window.FIREBASE_READY) throw new Error('Firebase not configured');

  await initFirebase();
  if (!firebaseStorage) throw new Error('Firebase Storage not available');

  const { ref, uploadBytes, getDownloadURL } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js');

  const ext = file.name.split('.').pop().toLowerCase();
  const fileName = `covers/${trackId}_${Date.now()}.${ext}`;
  const storageRef = ref(firebaseStorage, fileName);

  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
};
