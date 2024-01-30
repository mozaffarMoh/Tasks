import { ComponentType, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const withAuthUser = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const withAuth: React.FC<P> = (props) => {
    const router = useRouter();
    const user = Cookies.get("role") === "user";

    useEffect(() => {
      !user && router.push("/pages/tasks");
    }, [router]);

    return <>{user ? <WrappedComponent {...props} /> : null}</>;
  };
  return withAuth;
};

export default withAuthUser;
