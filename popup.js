document.getElementById('saveImageButton').addEventListener('click', () => {
    const imageName = document.getElementById('imageName').value;
    const folderName = document.getElementById('folderName').value;
    chrome.runtime.sendMessage({
        type: 'SAVE_IMAGE',
        title: imageName,
        folderName: folderName
    });
    window.close();
});