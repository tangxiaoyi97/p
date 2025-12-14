Newton's Law of Universal GravitationThe law states that every point mass attracts every other point mass by a force acting along the line intersecting the two points. The force is proportional to the product of the two masses, and inversely proportional to the square of the distance between them.The equation is:$$F = G \frac{m_1 m_2}{r^2}$$Interactive SimulationBelow is a live demonstration of this law.Instructions:Drag the blue ($m_1$) or green ($m_2$) spheres to change the distance ($r$).Use the Sliders at the bottom to change the mass of the objects or the Gravitational Constant ($G$).Observe how the Force vectors ($F_1$ and $F_2$) change in size.

<docsilab 
    src="experiments/newton.html" 
    title="万有引力交互演示 (Newton's Law)" 
    m1="50"       
    m2="100"      
    g="1000"    
    dist="250"    
    show_grid="true"
/>

Docsilab HTML StandardFor an HTML file to work perfectly with Docsilab, please follow these guidelines:Responsiveness: The HTML body should have margin: 0 and adapt to window.innerWidth.Self-Contained: Ideally, keep CSS and JS within the HTML file to avoid path resolution errors in complex folder structures.No Scrollbars: Set body { overflow: hidden; } if you are doing a canvas simulation, to prevent double scrollbars in the docs.