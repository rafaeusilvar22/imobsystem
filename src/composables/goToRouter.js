import { useRouter } from "vue-router";
import { useEnterpriseStore } from "../stores/enterprise";

export function useGotoRouter() {
  const router = useRouter();
  const enterpriseStore = useEnterpriseStore();
  const enterpriseData = enterpriseStore.currentEnterpriseData;

  const handleGoToPage = (route) => {
    router.push({ path: `${route}/${enterpriseData.identification_url}` });
  };



  return { handleGoToPage };
}
