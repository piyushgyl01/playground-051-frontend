import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";

export default function Home() {
  const { data, loading, error, refetch } = useFetch(
    `${import.meta.env.VITE_API_URL}/movies`
  );

  async function handleDelete(id) {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/movies/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          refetch();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <main className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Movies List</h2>
        <Link to="/post" className="btn btn-success">
          Add New Movie
        </Link>
      </div>

      {loading && (
        <div className="d-flex justify-content-center align-items-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="d-flex justify-content-center align-items-center">
          <div className="alert alert-danger">{error}</div>
        </div>
      )}

      {data && data.length === 0 && (
        <div className="alert alert-info">
          No Movies found. Add your first movie!
        </div>
      )}

      <div className="row">
        {data &&
          data.map((movie) => (
            <div className="col-md-12 mb-4 list-group" key={movie._id}>
              <div className="list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-between">
                  <h5 className="mb-1">
                    {movie.name} by {movie.director}
                  </h5>
                  <small className="text-body-secondary">
                    {new Date(movie.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <p>{movie.plot}</p>
                <Link
                  to={`/details/${movie._id}`}
                  className="btn btn-primary me-2 mt-1"
                >
                  View Details
                </Link>
                <button
                  className="btn btn-danger mt-1"
                  onClick={() => handleDelete(movie._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}
