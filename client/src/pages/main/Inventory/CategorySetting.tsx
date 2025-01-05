import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  Collapse,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../../../actions/api";

interface Category {
  name: string;
  subCategories: string[];
}

const CategoryForm: React.FC = () => {
  const [type, setType] = useState<string>("Category");
  const [categoryName, setCategoryName] = useState<string>("");
  const [subCategoryName, setSubCategoryName] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(
    null
  );
  const [selectedParent, setSelectedParent] = useState<string>("");

  const handleTypeChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setType(e.target.value as string);
    setSubCategoryName(""); // Reset subcategory name when changing type
    setSelectedParent(""); // Reset selected parent when changing type
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/category/all`
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (type === "Category" && categoryName) {
      const newCategory: Category = {
        name: categoryName,
        subCategories: [],
      };
      try {
        const response = await axiosInstance.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/category/add`,
          newCategory
        );
        setCategories([...categories, response.data]);
        setCategoryName("");
      } catch (error) {
        console.error("Error adding category:", error);
      }
    } else if (type === "Subcategory" && subCategoryName && selectedParent) {
      const categoryId = categories.find((category) => category.name == selectedParent)
      const newSubCategory = {
        name: subCategoryName,
        parentId: categoryId,
      };
      try {
        await axiosInstance.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/category/subcategory/add`,
          newSubCategory
        );
        const updatedCategories = categories.map((cat) => {
          if (cat.name === selectedParent) {
            return {
              ...cat,
              subCategories: [...cat.subCategories, subCategoryName],
            };
          }
          return cat;
        });
        setCategories(updatedCategories);
        setSubCategoryName("");
        setSelectedParent("");
      } catch (error) {
        console.error("Error adding subcategory:", error);
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleToggle = (index: number) => {
    setOpenCategoryIndex(openCategoryIndex === index ? null : index);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box sx={{ width: "30%", borderRight: "1px solid #ccc", padding: 2 }}>
        <Typography variant="h6" sx={{ textAlign: "left" }}>
          Categories
        </Typography>
        <List>
          {categories.map((cat, index) => (
            <div key={index}>
              <ListItem
                component="div"
                onClick={() => handleToggle(index)}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <ListItemText primary={cat.name} />
                <div>
                  {/* <Button
                    onClick={() => handleDelete(cat)}
                    color="error"
                    size="small"
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button> */}
                  {openCategoryIndex === index ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </div>
              </ListItem>
              <Collapse
                in={openCategoryIndex === index}
                timeout="auto"
                unmountOnExit
              >
                <List
                  component="div"
                  disablePadding
                  sx={{ marginLeft: "12px" }}
                >
                  {cat.subCategories.map((sub, subIndex) => (
                    <ListItem key={subIndex}>
                      <ListItemText primary={sub} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </div>
          ))}
        </List>
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ flexGrow: 1, padding: 2 }}
      >
        <Typography variant="h6" sx={{ textAlign: "left" }}>
          Add Category or Subcategory
        </Typography>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="type-select-label">Type</InputLabel>
          <Select
            value={type}
            onChange={handleTypeChange}
            labelId="type-select-label"
            label="Label"
          >
            <MenuItem value="Category">Category</MenuItem>
            <MenuItem value="Subcategory">Subcategory</MenuItem>
          </Select>
        </FormControl>

        {type === "Category" ? (
          <TextField
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
          />
        ) : (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="parent-select-label">Parent</InputLabel>
              <Select
                value={selectedParent}
                onChange={(e) => setSelectedParent(e.target.value as string)}
                labelId="parent-select-label"
                label="Label"
                required
              >
                {categories.map((cat, index) => (
                  <MenuItem key={index} value={cat.name}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Subcategory Name"
              value={subCategoryName}
              onChange={(e) => setSubCategoryName(e.target.value)}
              fullWidth
              required
              sx={{ mb: 2 }}
            />
          </>
        )}

        <Button type="submit" variant="contained">
          Add
        </Button>
      </Box>
    </Box>
  );
};

export default CategoryForm;
