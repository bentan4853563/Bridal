import React from 'react'
import { addBaseURL } from '../../utils/updateURL'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useState } from 'react'

const ItemDetails = ({ item }) => {
  const dispatch = useDispatch()

  const categories = useSelector((state) => state.category.categories)

  const [category, setCategory] = useState(null)

  useEffect(() => {
    const category = categories.find((category) => category._id == item.category)
    if (category) {
      setCategory(category)
    }
  }, [categories, item.category])
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column - Images */}
      <div className="space-y-6">
        <div className="aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/10 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <img
            src={addBaseURL(item.primaryPhoto)}
            alt={item.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Secondary Photos Grid */}
        <div className="grid grid-cols-4 gap-4">
          {item.secondaryPhotos?.map((photo, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden bg-white/5 border border-white/10 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={photo}
                alt={`${item.name} - ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* Videos */}
        {item.videoUrls && item.videoUrls.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Videos
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {item.videoUrls.map((video, index) => (
                <div
                  key={index}
                  className="aspect-video rounded-lg overflow-hidden bg-white/5 border border-white/10 shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <video
                    src={video}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Details */}
      <div className="space-y-6">
        {/* Name Section */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
          <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
            Name
          </label>
          <p className="text-lg text-white font-medium">{item.name}</p>
        </div>

        {/* Category & SubCategory Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
              Category
            </label>
            <p className="text-white">{category?.name}</p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
              Sub Category
            </label>
            <p className="text-white">{item.subCategory}</p>
          </div>
        </div>

        {/* Description Section */}
        {category?.description && <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
          <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
            Description
          </label>
          <p className="text-white whitespace-pre-wrap leading-relaxed">
            {item?.description}
          </p>
        </div>}

        {/* Price & Quantity Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
              Rental Cost
            </label>
            <p className="text-xl text-white font-semibold">
              ${item.rentalCost}
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
            <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
              Quantity Available
            </label>
            <p className="text-xl text-white font-semibold">
              {item.quantity} units
            </p>
          </div>
        </div>

        {/* Status Section */}
        <div className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors duration-300">
          <label className="text-sm font-medium text-gray-400 uppercase tracking-wider block mb-1">
            Status
          </label>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              item.status === "Published"
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
            }`}
          >
            {item.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ItemDetails