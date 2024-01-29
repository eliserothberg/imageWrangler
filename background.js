chrome.contextMenus.create({
    id: "saveWrangledImage",
    title: "Save Wrangled Image",
    contexts: ["image"]
});

// Context menu item click listener
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "saveWrangledImage") {
        const imageUrl = info.srcUrl;
        const pageUrl = tab.url;
        const defaultFolderName = 'ImageWrangler';

        // Search for the 'ImageWrangler' folder or create it if it doesn't exist
        chrome.bookmarks.search({ title: defaultFolderName }, (results) => {
            let folderId = results.length > 0 ? results[0].id : null;
            if (!folderId) {
                chrome.bookmarks.create({ title: defaultFolderName }, (newFolder) => {
                    folderId = newFolder.id;
                    createBookmark(folderId, pageUrl, imageUrl); // Image URL bookmark with page URL as title
                });
            } else {
                createBookmark(folderId, pageUrl, imageUrl);
            }
        });
    }
});

function createBookmark(folderId, title, url) {
    chrome.bookmarks.create({
        parentId: folderId,
        title: title,
        url: url
    }, (bookmark) => {
        if (bookmark) {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'images/icon48.png',
                title: 'Bookmark Saved',
                message: 'Your bookmark from ' + title + ' was saved successfully!'
            });
        } else {
            chrome.notifications.create({
                type: 'basic',
                iconUrl: 'images/icon48.png',
                title: 'Bookmark Failed',
                message: 'Failed to save the bookmark from ' + title + '.'
            });
        }
    });
}