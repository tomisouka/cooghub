Analogy

You (Customer) → Menu (API) → Kitchen (System)

You don't go into the kitchen and cook
You don't need to know HOW they cook
You just order from the menu
The kitchen does the work
You get your food

-------
No API Example

You want to know the weather in New York

You would need to:
1. Find weather station servers
2. Understand their database structure
3. Write code to connect to their hardware
4. Parse raw sensor data
5. Convert units
6. Handle errors

= Impossible for normal developers

---------------------------
With API

// Call weather API
fetch('api.weather.com/current?city=NewYork')
  .then(response => response.json())
  .then(data => console.log(data.temperature))

// Output: 72°F

Done in 3 lines!

------------------------
Types of APIs

Web API

// Post a tweet
POST /tweets
Body: { "text": "Hello world!" }

// Twitter's servers handle everything
// You just use the API

Operating System API

// Create a window
CreateWindow("My App Window");

// Windows handles the actual window creation
// You just call the API function

Graphic API

// DirectX 12 code
DrawTriangle(x, y, z);

// Behind the scenes:
// - API translates to GPU commands
// - Driver sends to hardware
// - GPU renders triangle
```

---

### **4. Hardware APIs**
How software controls specific hardware

**Examples:**
- **CUDA** (Nvidia GPU computing)
- **ROCm** (AMD GPU computing)
- **AVX** (CPU vector instructions)

---

## **Why APIs Matter:**

### **Without APIs:**
```
Every app developer needs to:
- Write GPU drivers
- Write networking code
- Write file system code
- Write display code
- Write audio code

= Takes years, requires hardware expertise
```

### **With APIs:**
```
Developer: "API, save this file"
API: "Done"

Developer: "API, connect to internet"
API: "Connected"

Developer: "API, render this 3D model"
API: "Rendered"

= App built in weeks/months

------------------------------
