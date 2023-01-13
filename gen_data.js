const { writeFileSync } = require('fs')

const numDataPoints = 250
const minSize = 10
const maxSize = 5000 + 1
const points = []
const radToDeg = 180 / Math.PI

function getRandCoord() {
    return Math.floor(Math.random() * (maxSize - minSize)) + minSize
}


for (let id = 0; id < numDataPoints; id++) {
    const x = getRandCoord()
    const y = getRandCoord()
    const a = x ** 2
    const b = y ** 2
    const angle_rad = Math.atan(x / y)
    const angle_deg = Math.atan(x / y) * radToDeg
    const originDistance = Math.sqrt(a + b)
    const originDistanceSquared = a + b
    points.push({ id, x, y, a, b, originDistance, angle_rad, angle_deg, originDistanceSquared })
}

console.log(`${points.length} records created.`);
console.log(points[0]);

writeFileSync('points.json', JSON.stringify(points))