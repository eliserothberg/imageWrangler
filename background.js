// Create the context menu item
chrome.contextMenus.create({
    id: "saveWrangledImage",
    title: "Save Wrangled Image",
    contexts: ["image"]
});

// Add listener for context menu item clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "saveWrangledImage") {
        const imageUrl = info.srcUrl;
        const pageUrl = tab.url;
        const defaultFolderName = 'ImageWrangler';
        let folderName = prompt("Enter the folder name to save the image:", defaultFolderName);

        if (folderName === null) {
            folderName = defaultFolderName; // Use default if prompt is cancelled
        }

        // Search for the specified folder or create it if it doesn't exist
        chrome.bookmarks.search({ title: folderName }, (results) => {
            let folderId = results.length > 0 ? results[0].id : null;
            if (!folderId) {
                chrome.bookmarks.create({ title: folderName }, (newFolder) => {
                    folderId = newFolder.id;
                    createBookmark(folderId, pageUrl, imageUrl);
                });
            } else {
                createBookmark(folderId, pageUrl, imageUrl);
            }
        });
    }
});

// Function to create a bookmark
function createBookmark(folderId, title, url) {
    chrome.bookmarks.create({
        parentId: folderId,
        title: title,
        url: url
    }, (bookmark) => {
        console.log('Bookmark created: ', bookmark);
    });
}