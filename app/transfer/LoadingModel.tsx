import { useStore } from "@/store";
import { observer } from "mobx-react-lite";

function LoadingModel() {
  const { hasInit } = useStore().transferModelStore;
  return (
    <>
      {!hasInit && (
        <div className='flex'>
          <div className='text-3xl text-primary'>正在加载模型</div>
          <div className='loading loading-dots text-primary'></div>
        </div>
      )}
    </>
  );
}
export default observer(LoadingModel);
