import { ComponentType, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const withAuthAdmin = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  const withAuth: React.FC<P> = (props) => {
    const router = useRouter();
    const token = Cookies.get("role") === "admin";
    const admin = Cookies.get("role") === "admin";

    useEffect(() => {
      if (token) {
        !admin && router.push("/pages/tasks-user");
      } else {
        router.push("/pages/auth/login-admin");
      }
    }, [router]);

    return <>{admin ? <WrappedComponent {...props} /> : null}</>;
  };
  return withAuth;
};

export default withAuthAdmin;
