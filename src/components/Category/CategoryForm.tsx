import React, { useState } from 'react';
import {
    Typography, 
    Grid,
    Box,
} from "@mui/material";
import ImageSelection from '../common/ImageSelection';

// Define interface matching what ImageSelection expects
interface CollectionForm {
  id: number;
  url: string;
  selected: boolean;
}

const CollectionForm: React.FC = () => {
  const [collectionName, setCollectionName] = useState('');

  // Initialize with the correct structure that includes id and selected properties
  const [images, setImages] = useState<CollectionForm[]>([]);

  return (
    <div className="ml-8 mr-8 mb-6">
      <div className="collection-form-content mb-4 space-y-8 mx-auto overflow-hidden example" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="form-group text-left">
          <Typography variant="subtitle1" gutterBottom align="left">
            COLLECTION NAME
          </Typography>
          <input
            type="text"
            id="collectionName"
            placeholder="Enter Collection Name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
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
              Collection Images
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
      </div>
    </div>
  );
};

export default CollectionForm;