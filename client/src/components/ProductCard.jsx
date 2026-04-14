import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/products/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-indigo-600 truncate">
            {product.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>
        <div className="mt-2 flex justify-between items-center">
          <span className="text-xl font-bold text-indigo-600">${product.price?.toFixed(2)}</span>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>
        {product.ratings && product.ratings.length > 0 && (
          <div className="mt-2 flex items-center">
            <span className="text-yellow-500">⭐</span>
            <span className="text-sm text-gray-600 ml-1">
              {(product.ratings.reduce((a, b) => a + b, 0) / product.ratings.length).toFixed(1)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
