import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useLocation } from "react-router-dom";

export default function BasicBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const capitalize = (str: string) =>
    str?.charAt(0).toUpperCase() + str?.slice(1);

  return (
    <Breadcrumbs aria-label="breadcrumb" sx={{ py: 1 }}>
      {pathnames.length > 1 && (
        <Link to={`/${pathnames[0]}`} className="hover:underline text-2xl">
          {capitalize(pathnames[0])}
        </Link>
      )}
      {pathnames.length > 1 ? (
        <span className="text-xl text-black">{capitalize(pathnames[1])}</span>
      ) : (
        <span className="text-xl text-black">{capitalize(pathnames[0])}</span>
      )}
    </Breadcrumbs>
  );
}
