import { Button, Chip, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
import {
  handleAddCategory,
  handleAddSubCategory,
  handleGetCategoryList,
  handleGetSubCategoryList,
  handleDeleteCategory,
  handleDeleteSubCategory,
} from "../../../actions/category";
import { Category } from "../../../types";
import { confirmAlert } from "react-confirm-alert";
import { toast } from "react-toastify";

export default function CategorySetting() {
  const [category, setCategory] = useState<string | null>(null);
  const [subCategory, setSubCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryList = await handleGetCategoryList();
        const subCategoryList = await handleGetSubCategoryList();

        if (categoryList) {
          setCategories(categoryList);
        }
        if (subCategoryList) {
          setSubCategories(subCategoryList);
        }
      } catch (err) {
        console.log(err);
        setError("Failed to fetch categories or subcategories.");
        setSnackbarOpen(true);
      }
    };

    fetchData();
  }, []);

  const addCategory = async () => {
    if (category) {
      if (categories.some((cat) => cat.name === category)) {
        setError("This Category already exists!");
        setSnackbarOpen(true);
        return;
      }
      try {
        const addedCategory: Category = await handleAddCategory(category);
        setCategories((prev) => [...prev, addedCategory]);
        toast.success("Added new category successfully")
        setCategory(null); // Clear input after adding
        setError(null); // Clear any previous errors
      } catch (err) {
        console.log(err);
        setError("Failed to add category.");
        setSnackbarOpen(true);
      }
    }
  };

  const addSubCategory = async () => {
    if (subCategory) {
      if (subCategories.some((subCat) => subCat.name === subCategory)) {
        setError("This Subcategory already exists!");
        setSnackbarOpen(true);
        return;
      }
      try {
        const addedSubCategory: Category = await handleAddSubCategory(
          subCategory
        );
        console.log('addedSubCategory :>> ', addedSubCategory);
        setSubCategories((prev) => [...prev, addedSubCategory]);
        toast.success("Added new subcategory successfully");
        setSubCategory(null); // Clear input after adding
        setError(null); // Clear any previous errors
      } catch (err) {
        console.log(err);
        setError("Failed to add subcategory.");
        setSnackbarOpen(true);
      }
    }
  };

  const deleteCategory = async (id: string) => {
    confirmAlert({
      title: "Delete category",
      message: "Are you sure you want to delete this category?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const deletedCategory: Category = await handleDeleteCategory(id);
              setCategories((prev) =>
                prev.filter((cat) => cat._id !== deletedCategory._id)
              );
            } catch (error) {
              console.error("Failed to delete category:", error);
              setError("Failed to delete category.");
              setSnackbarOpen(true);
            }
          },
        },
        {
          label: "No",
          onClick: () => console.log('cancel')
        },
      ],
    });
  };

  const deleteSubCategory = async (id: string) => {
    confirmAlert({
      title: "Delete subcategory",
      message: "Are you sure you want to delete this subcategory?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            try {
              const deletedSubCategory: Category = await handleDeleteSubCategory(id);
              setSubCategories((prev) =>
                prev.filter((cat) => cat._id !== deletedSubCategory._id)
              );
            } catch (error) {
              console.error("Failed to delete category:", error);
              setError("Failed to delete category.");
              setSnackbarOpen(true);
            }
          },
        },
        {
          label: "No",
          onClick: () => console.log('cancel')
        },
      ],
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="overflow-y-auto p-8 flex flex-col lg:flex-row gap-16">
      {/* Category */}
      <div className="flex flex-col flex-1 xl:flex-row gap-4">
        {/* Form */}
        <div className="flex flex-col xl:flex-1 gap-2">
          <label htmlFor="category" className="text-left">
            Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            value={category || ""}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg p-2"
          />
          <Button variant="contained" onClick={addCategory}>
            Add Category
          </Button>
        </div>
        {/* List */}
        <div className="xl:max-w-sm flex flex-col flex-1 gap-2 overflow-y-auto">
          <label htmlFor="categories" className="text-left">
            Categories
          </label>
          <div className="box min-h-32 p-4 flex flex-wrap gap-4">
            {categories.map((category) => (
              <Chip
                key={category._id} // Use a unique ID if available
                label={category.name}
                onDelete={() => deleteCategory(category._id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sub Category */}
      <div className="flex flex-col flex-1 xl:flex-row gap-4">
        <div className="flex flex-col xl:flex-1 gap-2">
          <label htmlFor="subcategory" className="text-left">
            Sub Category
          </label>
          <input
            type="text"
            name="subcategory"
            id="subcategory"
            value={subCategory || ""}
            onChange={(e) => setSubCategory(e.target.value)}
            className="border rounded-lg p-2"
          />
          <Button variant="contained" onClick={addSubCategory}>
            Add SubCategory
          </Button>
        </div>
        <div className="xl:max-w-sm flex flex-col flex-1 gap-2 overflow-y-auto">
          <label htmlFor="subcategories" className="text-left">
            Sub Categories
          </label>
          <div className="box min-h-32 p-4 flex flex-wrap gap-4">
            {subCategories.map((subCat) => (
              <Chip
                key={subCat._id} // Use a unique ID if available
                label={subCat.name}
                onDelete={() => deleteSubCategory(subCat._id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Snackbar for error messages */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={error}
      />
    </div>
  );
}
