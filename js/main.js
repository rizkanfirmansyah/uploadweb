document.getElementById('uploadForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const responseMessage = document.getElementById('responseMessage');
    const progressBar = document.getElementById('progressBar');
    const progress = document.getElementById('progress');
    const submitBtn = document.getElementById('submitBtn');

    // Validate file types
    for (let file of formData.getAll('files[]')) {
        if (!['application/pdf', 'image/png'].includes(file.type)) {
            responseMessage.textContent = 'Invalid file type. Only PDF and PNG files are allowed.';
            responseMessage.className = 'text-red-500';
            return;
        }
    }

    // Show progress bar
    progressBar.classList.remove('hidden');
    progress.textContent = '0%';

    try {
        submitBtn.disabled = false;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'src/upload.php', true);

        // Update progress
        xhr.upload.addEventListener('progress', function (e) {
            if (e.lengthComputable) {
                const percent = Math.round((e.loaded / e.total) * 100);
                progress.textContent = `${percent}%`;
                progress.style.width = `${percent}%`;
            }
        });

        // Handle response
        xhr.addEventListener('load', function () {
            const result = JSON.parse(xhr.responseText);
            responseMessage.textContent = result.message;
            responseMessage.className = result.success ? 'text-green-500' : 'text-red-500';
            submitBtn.disabled = false;
            if (result.success) {
                document.getElementById('fileInput').value = '';
            }
        });

        xhr.addEventListener('error', function () {
            responseMessage.textContent = 'An error occurred.';
            responseMessage.className = 'text-red-500';
            submitBtn.disabled = false;
        });

        xhr.send(formData);
    } catch (error) {
        responseMessage.textContent = 'An error occurred.';
        responseMessage.className = 'text-red-500';
        submitBtn.disabled = false;
    }
});
