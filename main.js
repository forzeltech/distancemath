'use strict'

// so....the goal here is to determine the most efficient way of
// filtering and sorting distances between points by pre-computing 
// as much of the data as possible. I will generate some dummy
// data and create a few different functions to test and time them
// to see if there is any significant difference.

//b^2 = a^2 + c^2 - 2ac*(cos B)

const points = require('./points.json')
const radToDeg = 180 / Math.PI

console.log(points[0]);

function d1(set1, set2) {
    let a = Math.abs(set1.x - set2.x)
    let b = Math.abs(set1.y - set2.y)
    let r = Math.sqrt((a ** 2) + (b ** 2))
    return r
}
function d2(set1, set2) {
    const angle_diff = Math.abs(set2.angle_deg - set1.angle_deg)
    let a = set1.originDistance
    let c = set2.originDistance
    let b = (a ** 2) + (c ** 2)
    let cos = Math.cos(angle_diff / radToDeg)
    b = b - (2 * a * c * cos)
    b = Math.sqrt(b)
    return b
}
function d3(set1, set2) {
    const angle_diff = Math.abs(set2.angle_rad - set1.angle_rad)
    const cos = Math.cos(angle_diff)
    const a = set1.originDistance
    const c = set2.originDistance
    const d = set1.originDistanceSquared + set2.originDistanceSquared
    const e = d - (2 * a * c * cos)
    return Math.sqrt(e)
}
function d4(set1, set2) {
    return Math.sqrt(set1.originDistanceSquared + set2.originDistanceSquared - (2 * set1.originDistance * set2.originDistance * Math.cos(Math.abs(set2.angle_rad - set1.angle_rad))))
}
function d5(set1, set2) {
    const angle_diff = Math.abs(set2.angle_rad - set1.angle_rad)
    const cos = Math.cos(angle_diff)
    const a = set1.originDistance
    const c = set2.originDistance
    const d = (set1.originDistance ** 2) + (set2.originDistance ** 2)
    const e = d - (2 * a * c * cos)
    return Math.sqrt(e)
}
function timer(fn, callback) {
    const t = process.hrtime()
    const res = fn()
    callback(process.hrtime(t), res)
}

function test() {
    const results = []
    let count = 0
    for (const point of points) {
        for (const p2 of points) {
            timer(() => {
                return d3(point, p2)
            }, (time, result) => {
                results.push({ count, time, result })
            })
            count++
        }
    }
    return results
}

console.time('test1')
const res = test()
const sumtime = res.reduce((total, item) => total + item.time[1], 0)
console.log('Average time: ' + sumtime / res.length);
console.log(res.length, res[3]);
console.timeEnd('test1')