export function updateAspectRatio() {
  /* adjust near plane to browser window aspect ratio*/
  window.camera.aspect = window.innerWidth / window.innerHeight;
  /* adjust projection matrix */
  window.camera.updateProjectionMatrix();

  /* adjust frame buffer */
  window.renderer.setSize(window.innerWidth, window.innerHeight);
}