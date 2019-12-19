const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

const Vendor_Schema = new mongoose.Schema({

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6
  },
  phone: {
    type: String
  },
  zipcode: {
    type: String
  },
  business_name: {
    type: String,
    unique: true
  },
  slug: String,
  description: {
    type: String
  },
  avatar: {
    type: String,
    default: 'no-photo.jpg'
  },
  vendor_banner: {
    type: String,
    default: 'no-photo.jpg'
  },
  vendor_category: {
    type: [String],
    enum: [
      "Vegetables",
      "Fruits",
      "Breads",
      "Baked goods",
      "Beverages",
      "Spreads",
      "Other"
    ]
  },
  created_at: {
    type: Date
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  //vendor location
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point']
    },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  //Vendor bulletin
  bulletin: String,
  created_at: {
    type: Date,
    default: Date.now
  }

});

// Encrypt password using bcrypt
Vendor_Schema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Create a 'slug' based on business_name for fontend to make routes
Vendor_Schema.pre('save', function (next) {
  this.slug = slugify(this.business_name, { lower: true });
  next();
});

// Match user entered password to hashed password in database
Vendor_Schema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Vendors', Vendor_Schema);
