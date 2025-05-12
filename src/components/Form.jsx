import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Form({ isEdit }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    charName: "",
    charSeries: "",
    charAuth: "",
  });

  const [apiError, setApiError] = useState(null);

  const { data, loading, error } = useFetch(
    `${import.meta.env.VITE_API_URL}/chars/${id}`
  );

  useEffect(() => {
    if (isEdit && data) {
      setFormData({
        charName: data?.charName || "",
        charSeries: data?.charSeries || "",
        charAuth: data?.charAuth || "",
      });
    }
  }, [isEdit, data, id]);

  async function handleSubmit(e) {
    e.preventDefault();
    setApiError(null);

    try {
      if (isEdit) {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/chars/${id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          navigate(`/details/${id}`);
        } else {
          const errorData = await response.json();
          setApiError(errorData.message || "Failed to update startup");
        }
      } else {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/chars`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const createdChar = await response.json();
          navigate(`/details/${createdChar._id}`);
        } else {
          const errorData = await response.json();
          setApiError(errorData.message || "Failed to create new startup");
        }
      }
    } catch (error) {
      console.log(error);
      setApiError("Network error occurred");
    }
  }
  return (
    <>
      {isEdit && loading ? (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="card shadow border-0">
          <div className="card-body p-4">
            <h2 className="card-title mb-4">
              {isEdit ? "Edit Book" : "Add New Book"}
            </h2>

            {(error || apiError) && (
              <div className="d-flex justify-content-center align-items-center">
                <div className="alert alert-danger">{error || apiError}</div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="charName" className="form-label">
                  Char Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  charName="charName"
                  id="charName"
                  placeholder="e.g., Gojo Satoru"
                  value={formData.charName}
                  onChange={(e) =>
                    setFormData({ ...formData, charName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="charSeries" className="form-label">
                  Char Series
                </label>
                <textarea
                  className="form-control"
                  charName="charSeries"
                  id="charSeries"
                  placeholder="e.g., Jujutsu Kaisen"
                  value={formData.charSeries}
                  onChange={(e) =>
                    setFormData({ ...formData, charSeries: e.target.value })
                  }
                  rows={8}
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="charAuth" className="form-label">
                  Char Auth
                </label>
                <input
                  type="text"
                  className="form-control"
                  charName="charAuth"
                  id="charAuth"
                  placeholder="e.g., Gege"
                  value={formData.charAuth}
                  onChange={(e) =>
                    setFormData({ ...formData, charAuth: e.target.value })
                  }
                  required
                />
              </div>
              <div className="d-flex gap-2">
                <Link
                  to={isEdit ? `/details/${id}` : "/"}
                  className="btn btn-secondary"
                >
                  Cancel
                </Link>
                <button type="submit" className="btn btn-primary">
                  {isEdit ? "Save Changes" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
