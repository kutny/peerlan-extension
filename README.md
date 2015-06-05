Peerlan extension
======================

[Peerlan](https://peerlan.com/) is Bondora loan analytics & investing automation tool.
Currently Bondora does not provide any API, that's the reason why Peerlan users must install this extension. For more details see [Investing automation FAQ](https://peerlan.com/semi-automatic-investing#faq).

**How to navigate in this repository?**

Start with the __manifest.json__ file. It's the main Google Chrome extension definition file.
Check the "permissions" part of the manifest to find out what the Peerlan extension __is and is NOT allowed to do__.

Some notes:

* You might notice the __peerlan.my__ hostname. It is my dev environment hostname. When I publish the extension in the Chrome store, I always change it to __peerlan.com__.
* You can see that only bondora.cz hostname is placed in the manifest file. It's just another simplification for my dev environment. When I publish the extension, I use a simple script to replace bondora.cz hostname with all existing Bondora hostnames (.cz, .com, .de, ...).

The most important part of this extension is the __/js/background.js__ file. It contains code that runs in the background and takes care of Bondora loans scraping. Check this file and the /js/PeerlanApp/BackgroundProcessHandler.js file to understand how this extension works.

**Contact**

If you have any questions please contact me at info@peerlan.com.

License
=======

This extension license: https://github.com/kutny/peerlan-extension/blob/master/LICENSE