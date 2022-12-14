const { calculateTip,fahrenheitToCesius,celsiusToFehrenhiet } = require('../src/math')

// test ('should calculate total whith tip',()=>{
//    const total= calculateTip(10, .3)
//    expect(total).toBe(13)
   
// })
// test('should calculate with default tip',()=>{
//    const total = calculateTip(10)
//    expect(total).toBe(12.5)
// })

test('should get 0 ',()=>{
   const total = fahrenheitToCesius(32)
   expect(total).toBe(0)
})
test('should get 32 ',()=>{
   const total = celsiusToFehrenhiet(0)
   expect(total).toBe(32)
})