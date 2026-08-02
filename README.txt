Wavero 1.0.6 — emergency embedded UI fix

Replace ONLY worker.js in the repository.
The Worker now contains the complete HTML interface inside itself and no longer imports index.html.
This removes the text-module/index-file dependency that can result in an empty page after deployment.
Do not delete index.html from the repository; it is simply no longer used by this worker version.
