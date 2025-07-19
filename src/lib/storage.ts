export async function uploadAvatar(file: File): Promise<string> {
  try {
    // Wait for Puter to be available
    if (typeof window === 'undefined' || !window.puter?.fs?.upload) {
      throw new Error('Puter storage is not available');
    }

    // Upload to Puter.js storage with proper file path
    const uploaded = await window.puter.fs.upload({
      file,
      name: `avatars/${Date.now()}-${file.name}`,
      visibility: 'public'
    });
    
    // Validate URL before returning
    if (!uploaded?.url) {
      throw new Error('Invalid upload response');
    }

    return uploaded.url;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw new Error('Failed to upload avatar. Please try again.');
  }
}