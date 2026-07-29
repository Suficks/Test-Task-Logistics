import { Button, Result } from "antd";
import { observer } from 'mobx-react-lite';

function handleRefresh() {
  localStorage.clear();
  window.location.reload();
}

export const ErrorPage = observer(function ErrorPage() {
  return (
    <div className="center-wrapper">
      <Result
        status="error"
        title="Что-то пошло не так"
        subTitle="Произошла непредвиденная ошибка. Попробуйте обновить страницу."
        extra={
          <Button onClick={handleRefresh} type="primary">
            Обновить страницу
          </Button>
        }
      />
    </div>
  );
});
