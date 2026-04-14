import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services';
import { useCart } from '../hooks/useCart';
import Spinner from '../components/Spinner';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getById(id);
        setProduct(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  if (loading) return <Spinner size="large" />;
  if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
  if (!product) return <div className="text-center mt-10">Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link to="/products" className="text-indigo-600 hover:underline mb-4 inline-block">
        ← Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/500x400?text=No+Image'}
            alt={product.title}
            className="w-full h-96 object-cover rounded-lg shadow-md"
          />
          {product.images && product.images.length > 1 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${product.title} ${index + 1}`}
                  className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-75"
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-2xl font-bold text-indigo-600 mt-4">${product.price?.toFixed(2)}</p>
          
          <div className="mt-4 flex items-center">
            <span className="text-yellow-500">⭐</span>
            {product.ratings && product.ratings.length > 0 ? (
              <span className="ml-2 text-gray-600">
                {(product.ratings.reduce((a, b) => a + b, 0) / product.ratings.length).toFixed(1)} 
                ({product.ratings.length} reviews)
              </span>
            ) : (
              <span className="ml-2 text-gray-400">No ratings yet</span>
            )}
          </div>

          <p className="text-gray-600 mt-6">{product.description}</p>

          <div className="mt-6">
            <span className="text-sm text-gray-500">Category: {product.category}</span>
          </div>

          <div className="mt-4">
            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>

          {product.stock > 0 && (
            <div className="mt-6 flex items-center space-x-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="mt-1 w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          )}

          <div className="mt-8 border-t pt-6">
            <p className="text-sm text-gray-500">
              Sold by: <Link to={`/stores/${product.store?._id}`} className="text-indigo-600 hover:underline">{product.store?.shopName || 'Unknown Store'}</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
