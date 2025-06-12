import VD from '../../assets/Cheerful Simple And Minimalist Cooking  Intro Video.mp4'

function Bander() {
  return (
   <section className="relative bg-white lg:grid lg:h-[90vh] lg:place-content-center dark:bg-gray-900 overflow-hidden">
  {/* Background Video */}
  <video
    className="absolute top-0 left-0 w-full h-full object-cover z-0"
    autoPlay
    loop
    muted
    playsInline
  >
    <source src={VD} type="video/mp4" />
    Your browser does not support the video tag.
  </video>

  {/* Optional Overlay for better text contrast */}
  <div className="absolute inset-0 bg-black opacity-57 z-1"></div>

  <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32 relative z-2">
    <div className="mx-auto max-w-prose text-center animate-fade-up animate-ease-in">
      <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
        
        Book Your Table 
        <strong className="text-yellow-400"> Online </strong>
        Today
      </h1>

      <p className="mt-4  text-pretty text-xl sm:text-lg/relaxed text-white">
         Enjoy a memorable meal with easy online reservations at MuMu Restaurant. Secure your spot and indulge in our delicious cuisine today.
      </p>

      <div className="mt-4 flex justify-center gap-4 sm:mt-6">
       

       
        
      </div>
    </div>
  </div>
</section>
  
        
    
  )
}

export default Bander