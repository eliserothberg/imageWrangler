let currentImageUrl = null;
let currentTabUrl = null;

// Create the context menu item
chrome.contextMenus.create({
    id: "saveWrangledImage",
    title: "Save Wrangled Image",
    contexts: ["image"]
});

// Add listener for context menu item clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "saveWrangledImage") {
        currentImageUrl = info.srcUrl;
        currentTabUrl = tab.url;
        chrome.action.openPopup({});
    }
});

// Listener for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'SAVE_IMAGE') {
        const folderName = request.folderName || 'ImageWrangler';
        const title = request.title || currentTabUrl;

        // Search for the specified folder or create it if it doesn't exist
        chrome.bookmarks.search({ title: folderName }, (results) => {
            let folderId = results.length > 0 ? results[0].id : null;
            if (!folderId) {
                chrome.bookmarks.create({ title: folderName }, (newFolder) => {
                    folderId = newFolder.id;
                    createBookmark(folderId, title, currentImageUrl);
                });
            } else {
                createBookmark(folderId, title, currentImageUrl);
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
