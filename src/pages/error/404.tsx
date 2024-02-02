import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

// 404 页面 参考链接：-> https://ant-design.antgroup.com/components/result-cn
const Error404 = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="页面不存在"
      extra={
        <Button
          onClick={() => {
            navigate("/", { replace: true });
          }}
          type="primary"
        >
          返回首页
        </Button>
      }
    />
  );
};

export default Error404;
