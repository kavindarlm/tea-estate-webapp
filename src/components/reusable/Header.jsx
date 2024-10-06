export default function Header() {
    return (
      <div className="relative isolate overflow-hidden bg-gray-900 py-4 sm:py-4 rounded-lg">
        <img
          src="/img/dashboard2.jpeg"
          alt="dashboard image"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-90 rounded-lg"
        />
        <div className="mx-auto max-w-7xl px-4 lg:px-4 flex flex-col justify-end mt-8">
          <div className="mx-auto max-w-7xl lg:mx-0">
            <p className="text-xl  tracking-tight text-white sm:text-3xl flex flex-col justify-end">Deniyaya-south Tea Estate</p>
          </div>
        </div>
      </div>
    )
  }