Using esbuild.

The Transform API will works in the browser without access to a file system. However, the Build API relies on a file system and will not work in the browser. If we were to pass esbuild an import statement like 

`import react from 'react'

By default Esbuild will look in its file system for a dependency called react. Since the browser does not have a file system, It will throw an error. 

Solution: 

Create a plugin that 
- will prevent esbuild from looking in a file system
- access the npm registry 
  - get URL for dependency 
  - provide to esbuild. 
- Provide esbuild the url. 

In the environment.tsx file, we can set a plugin when calling the build method of esbuild to a plugin that will do this for us. 


Another issue:

As we increase the number of packages, the number of requests increase as well. It will be a good idea to find a way to reduce the number of requests. We can implement a caching layer. 
- When we make a request, we will check the cache to see if we have made this request before. If so, we can return it immediatly.
- If we have not made the request, we can store it in our cache and return it. 
- Where will we store our cache files?  
  - indexedDB using `localForage`


Things to consider
- user can enter code that can throw an error and cause the app to crash.

- User can enter code that can mutate the DOM

- A malicious user can enter code that could take manipulate data of other users. 

Fix: use an iframe

Downsides of using iframe
- use of browser features such as cookies will be restricted