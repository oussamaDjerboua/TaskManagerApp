const calculateTip = (total,tipPercent=0.25)=>total+(total*tipPercent)


const fahrenheitToCesius = (temp) =>{
    return (temp-32)/1.8
}

const celsiusToFehrenhiet = (temp)=>{
    return (temp*1.8)+32
}
module.exports={
    calculateTip,
    fahrenheitToCesius,
    celsiusToFehrenhiet
}