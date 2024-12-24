import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { Link, useLocation } from "react-router-dom";

export default function BasicBreadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const capitalize = (str: string) =>
    str?.charAt(0).toUpperCase() + str?.slice(1);

  return (
      <Breadcrumbs aria-label="breadcrumb" sx={{py: 1}}>
        {pathnames.length > 1 && (
          <Link
            to={`/${pathnames[0]}`}
            className="hover:underline"
          >
            {capitalize(pathnames[0])}
          </Link>
        )}
        {pathnames.length > 1 ? (
          <Typography sx={{ color: "text.primary" }}>
            {capitalize(pathnames[1])}
          </Typography>
        ) : (
          <Typography sx={{ color: "text.primary" }}>
            {capitalize(pathnames[0])}
          </Typography>
        )}
      </Breadcrumbs>
  );
}
