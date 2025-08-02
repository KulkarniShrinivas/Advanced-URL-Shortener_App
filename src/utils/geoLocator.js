const geoip = require('geoip-lite');

exports.locate = (ipAdress) =>{
    const geo = geoip.lookup(ipAdress);
    if(geo){
        return{
            country: geo.country,
            city: geo.city,
        };
    }
    return {country: 'unknown', city: 'unknown'};
};