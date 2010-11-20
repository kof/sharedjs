## Idea of this project

Provide a bunch of most needed high level javascript utility functions, which will work in every browser and in nodejs.

## Features

- high level api with lots of sugar
- focused on speed (benchmarks for every test case)
- no native prototype extensions, no global namespace polution (be compartible to insecure env)
- use of ecma5 features if available and be ecma5 compatible if possible 
- don't reinvent the wheel, if there are parts of libs we could use - do it
- every function is as standalone as possible, to reduce dependencies (only if code overhead is minimal)
- no performance overhead for the server because of client support
- well tested
- community driven
- intelligent build tool (include only what you need)