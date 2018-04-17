const data = [
  {
    "picture": "http://placehold.it/32x32",
    "name": "Horne Boyd",
    "phone": "+1 (966) 582-3123",
    "address": "487 Batchelder Street, Clarence, Vermont, 7834"
  },
  {
    "picture": "http://placehold.it/32x32",
    "name": "Lauri Mathews",
    "phone": "+1 (974) 461-2269",
    "address": "323 Sharon Street, Cedarville, North Carolina, 6173"
  },
  {
    "picture": "http://placehold.it/32x32",
    "name": "Burgess Delaney",
    "phone": "+1 (835) 432-2442",
    "address": "165 Revere Place, Jardine, Ohio, 7801"
  },
  {
    "picture": "http://placehold.it/32x32",
    "name": "Pennington Frank",
    "phone": "+1 (862) 502-3376",
    "address": "237 Aitken Place, Kansas, Virginia, 2685"
  },
  {
    "picture": "http://placehold.it/32x32",
    "name": "Chrystal Ortiz",
    "phone": "+1 (826) 458-2571",
    "address": "253 Celeste Court, Linganore, District Of Columbia, 9095"
  },
  {
    "picture": "http://placehold.it/32x32",
    "name": "Horne Boyd",
    "phone": "+1 (966) 582-3123",
    "address": "487 Batchelder Street, Clarence, Vermont, 7834"
  },
  {
    "picture": "http://placehold.it/32x32",
    "name": "Lauri Mathews",
    "phone": "+1 (974) 461-2269",
    "address": "323 Sharon Street, Cedarville, North Carolina, 6173"
  },
  {
    "picture": "http://placehold.it/32x32",
    "name": "Burgess Delaney",
    "phone": "+1 (835) 432-2442",
    "address": "165 Revere Place, Jardine, Ohio, 7801"
  },
  {
    "picture": "http://placehold.it/32x32",
    "name": "Pennington Frank",
    "phone": "+1 (862) 502-3376",
    "address": "237 Aitken Place, Kansas, Virginia, 2685"
  },
  {
    "picture": "http://placehold.it/32x32",
    "name": "Chrystal Ortiz",
    "phone": "+1 (826) 458-2571",
    "address": "253 Celeste Court, Linganore, District Of Columbia, 9095"
  }
]

data.map(x=>{
  return x.id = Math.random() * 100
});

export default data;