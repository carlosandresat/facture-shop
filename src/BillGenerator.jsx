import { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import  flavors from './data/flavors'



const BillGenerator = () => {

  const [selectedFlavor, setSelectedFlavor] = useState(flavors[0]);
  const [selectedPresentation, setSelectedPresentation] = useState(flavors[0].availablePresentations[0]);
  const [selectedQuantity, setSelectedQuantity] = useState(1)
  const [cart, setCart] = useState([]);
  const [totalBill, setTotalBill] = useState(0);



  const handleFlavorChange = (event) => {
    const selectedFlavorId = parseInt(event.target.value);
    const flavor = flavors.find((flavor) => flavor.id === selectedFlavorId);
    setSelectedFlavor(flavor);
    setSelectedPresentation(flavor.availablePresentations[0]);
  };

  const handlePresentationChange = (event) => {
    const selectedPresentationId = event.target.value;
    setSelectedPresentation(selectedPresentationId);
  };

  const handleQuantityChange = (event) => {
    setSelectedQuantity(parseInt(event.target.value))
  };
  

  const handleAddToCart = () => {
    const newItem = {
      flavor: selectedFlavor,
      presentation: selectedPresentation,
      quantity: selectedQuantity,
    };
    setCart([...cart, newItem]); // Add the new item to the cart state
    setTotalBill(totalBill + newItem.flavor.prices[newItem.presentation] * newItem.quantity)
  };
  
  const handleDeleteFromCart = (index) => {
    const updatedCart = [...cart];
    const price = cart[index].flavor.prices[cart[index].presentation] * cart[index].quantity;
    setTotalBill(totalBill-price)

    updatedCart.splice(index, 1);
    setCart(updatedCart);
  };


  const handleDownload = () => {
    const doc = new jsPDF();
  
    doc.text('Factura', 10, 10);
    doc.setFontSize(12);
  
    const tableData = cart.map((item, index) => {
      const price = item.flavor.prices[item.presentation];
      const total = price * item.quantity;
  
      return [
        index + 1,
        `${item.flavor.name} - ${item.presentation}`,
        item.quantity,
        price.toFixed(2),
        total.toFixed(2),
      ];
    });
  
    doc.autoTable({
      startY: 20,
      head: [['#', 'Producto', 'Cantidad', 'Precio', 'Total']],
      body: tableData,
    });

    doc.text(`Total final: ${totalBill.toFixed(2)}`, 150, tableData.length*8 + 40);

  
    doc.save('factura.pdf');
  };
  
  return (
    <div>
      <h1>Facturador de Pulpas XD</h1>
      <div>
        <label>
          Sabor:
          <select value={selectedFlavor.id} onChange={handleFlavorChange}>
            {flavors.map((flavor) => (
              <option key={flavor.id} value={flavor.id}>
                {flavor.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Presentación:
          <select value={selectedPresentation} onChange={handlePresentationChange}>
            {selectedFlavor.availablePresentations.map((presentation) => (
              <option key={presentation} value={presentation}>
                {presentation}
              </option>
            ))}
          </select>
        </label>
        <div>
          <label>
            Cantidad:
            <input
              type="number"
              min="1"
              value={selectedQuantity}
              onChange={handleQuantityChange}
            />
          </label>
          <button onClick={handleAddToCart}>Agregar</button>
        </div>
      </div>
      <div>
        <p>Precio: ${selectedFlavor.prices[selectedPresentation].toFixed(2)}</p>
      </div>
      <div>
        <h2>Carrito:</h2>
        {cart.length === 0 ? (
          <p>No hay elementos en el carrito.</p>
        ) : (
          <ul>
            {cart.map((item, index) => (
              <li key={index}>
                {item.flavor.name} - {item.presentation} - Cantidad: {item.quantity}
                <button onClick={() => handleDeleteFromCart(index)}>Eliminar</button>
              </li>
            ))}
          </ul>
        )}
        <div>
        <p>Precio total: ${totalBill.toFixed(2)}</p>
      </div>
      </div>
      <button disabled={cart.length === 0} onClick={handleDownload}>
        Generar Factura
      </button>
    </div>
  );
  
};

export default BillGenerator;