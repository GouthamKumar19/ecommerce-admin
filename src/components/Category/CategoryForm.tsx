import React, { useState } from 'react';
import {
    Typography, 
    Grid,
    Box,
    IconButton
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageSelection from '../common/ImageSelection';
import SubcategoryForm from './SubcategoryForm'; // Import the SubCategoryForm

// Define interface matching what ImageSelection expects
interface ProductForm {
  id: number;
  url: string;
  selected: boolean;
}

const CategoryForm: React.FC = () => {
  const [categoryName, setCategoryName] = useState('');

  // Initialize with the correct structure that includes id and selected properties
  const [images, setImages] = useState<ProductForm[]>([]);

  return (
    <div className="ml-8 mr-8 mb-6">
      <div className="relative ml-0">
        <div className="mb-6 text-left">
          <IconButton className="back-button" style={{ position: 'relative', left: '0px' }}>
            <ArrowBackIcon />
          </IconButton>
        </div>
        
        <div className="category-form-content mb-4 space-y-8 mx-auto overflow-hidden example" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="form-group text-left">
            <Typography variant="subtitle1" gutterBottom align="left">
              CATEGORY NAME
            </Typography>
            <input
              type="text"
              id="categoryName"
              placeholder="Enter Category Name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                boxSizing: 'border-box',
                borderRadius: '4px',
                border: '1px solid #ccc',
                marginBottom: '16px',
              }}
            />
          </div>
          
          <Grid container spacing={3} justifyContent="flex-start" style={{ flex: 1 }}>
            <Grid item xs={12} style={{ height: '100%' }}>
              <Typography variant="subtitle1" gutterBottom align="left">
                Category Images
              </Typography>
              <Box
                sx={{
                  bgcolor: 'white',
                  borderRadius: '6px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  p: 4,
                  width: '100%',
                }}
              >
                <ImageSelection images={images} setImages={setImages} />
              </Box>
            </Grid>
          </Grid>
          
          {/* Divider between Category and Subcategory sections */}
          <div className="divider" style={{ borderTop: '1px solid #eee', margin: '24px 0' }}></div>
          
          {/* Include the SubCategoryForm component */}
          <SubcategoryForm />
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;