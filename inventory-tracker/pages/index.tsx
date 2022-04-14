import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import {
  PlusCircleIcon,
  PencilAltIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import Modal from "../components/Modal";

interface Product {
  id: string;
  name: string;
  sku: string;
  image: string;
  quantity: number;
  storeId: string;
}

export default function Products({ products }) {
  const [newModal, setNewModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(0);

  const deleteProduct = async (productId: string) => {
    await axios.delete("/api/inventory?type=delete", { data: { productId } });
  };

  return (
    <div>
      <div className="flex gap-2" onClick={() => setNewModal(true)}>
        <div className="flex gap-2 bg-gray-700 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded-full m-6">
          <PlusCircleIcon className="h-6 w-6 text-green-500" />
          Add a product
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {products.length > 0 ? (
          products.map((product: Product, index: number) => (
            <div key={product.id} className="flex gap-6 border-b-2 w-full">
              <Image
                src={product.image}
                alt={product.name}
                width="100"
                height="100"
              />
              <div>{product.name}</div>
              <div>{product.quantity}</div>
              <div>{product.storeId}</div>
              <PencilAltIcon
                className="h-6 w-6 text-indigo-500"
                onClick={() => {
                  setIndex(index);
                  setEditModal(true);
                }}
              />
              <TrashIcon
                className="h-6 w-6 text-red-400"
                onClick={() => deleteProduct(product.id)}
              />
            </div>
          ))
        ) : (
          <div>Add some new products</div>
        )}
      </div>
      {newModal && <Modal product={{}} onCancel={() => setNewModal(false)} />}
      {editModal && (
        <Modal product={products[index]} onCancel={() => setEditModal(false)} />
      )}
    </div>
  );
}

export async function getServerSideProps() {
  const productsRes = await fetch(
    "http://localhost:3000/api/inventory?type=products"
  );

  const products = await productsRes.json();

  return {
    props: {
      products,
    },
  };
}
