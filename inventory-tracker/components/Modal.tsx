import axios from 'axios'

export default function Modal({ product, onCancel }) {
  const addProduct = async (e) => {
    e.preventDefault()

    const product = {
      name: e.target.name.value,
      sku: e.target.sku.value,
      image: e.target.image.value,
      quantity: Number(e.target.quantity.value),
      storeId: e.target.storeId.value,
    }

    await axios.post('/api/inventory?type=create', { product })

    onCancel()
  }

  const updateProduct = async (e) => {
    e.preventDefault()

    const modifiedProduct = {
      id: product.id,
      name: e.target.name.value,
      sku: e.target.sku.value,
      image: e.target.image.value,
      quantity: Number(e.target.quantity.value),
      storeId: e.target.storeId.value,
    }

    await axios.patch('/api/inventory?type=update', { modifiedProduct })

    onCancel()
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">Add a new product</h3>
                <div className="mt-2">
                  <form className="w-full max-w-sm" onSubmit={product ? updateProduct : addProduct}>
                    <div className="md:flex md:items-center mb-6">
                      <div className="md:w-1/3">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="name">
                          Product Name
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="product-name" name="name" type="text" defaultValue={product ? product.name : ''} />
                      </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                      <div className="md:w-1/3">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="sku">
                          SKU
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="sku" name="sku" type="text" defaultValue={product ? product.sku : ''} />
                      </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                      <div className="md:w-1/3">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="quantity">
                          Quantity
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="quantity" name="quantity" type="number" defaultValue={product ? product.quantity : 0} />
                      </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                      <div className="md:w-1/3">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="image">
                          Image
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="image" name="image" type="text" defaultValue={product ? product.image : ''} />
                      </div>
                    </div>
                    <div className="md:flex md:items-center mb-6">
                      <div className="md:w-1/3">
                        <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4" htmlFor="storeId">
                          Store Id
                        </label>
                      </div>
                      <div className="md:w-2/3">
                        <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500" id="storeId" name="storeId" type="text" defaultValue={product ? product.storeId : ''} />
                      </div>
                    </div>
                    <div className="md:flex md:items-center">
                      <div className="md:w-1/3"></div>
                      <div className="md:w-1/3">
                        <button className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="button" onClick={onCancel}>
                          Cancel
                        </button>
                      </div>
                      <div className="md:w-2/3">
                        <button className="shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                          Save Product
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}