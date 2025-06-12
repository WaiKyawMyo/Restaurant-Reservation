import cover from '../../assets/mala-dry-pot-6.jpg'

function Photo() {
  return (
    
    
<div className="flex flex-col-reverse lg:flex-row w-full items-center justify-center gap-9 lg:gap-7 p-10 animate-fade-up animate-once animate-ease-in animate-alternate animate-fill-both">
    <div className={` `}>
        <div className={`mx-auto w-79 h-[450px] lg:w-96 rounded-full lg:h-[600px] p-2 bg-cover overflow-hidden bg-center`}    style={{ backgroundImage: `url(${cover})` }}>

        </div>
    </div>
    <div className="">
        <div className=' flex flex-col h-full items-center justify-center w-72 mx-auto' >
            <h1 className='text-4xl font-bold mb-2 text-center font-cursive' >Our story</h1>
            <p className='text-center font-normal  '>
                At MuMu Restaurant, we bring the bold flavors of Sichuan’s Mala Xiang Guo to your table. Every dish is freshly stir-fried with your favorite choices and our special blend of spices, delivering a perfect balance of spicy and numbing tastes. Join us and experience a true taste of Sichuan—delicious, vibrant, and unforgettable!
            </p>
        </div>
    </div>
</div>


    
    
  )
}

export default Photo