import { observer } from 'mobx-react-lite';

import { Button, Flex, Result } from 'antd';
import { useNavigate } from '@tanstack/react-router';

export const NotFoundPage = observer(function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="center-wrapper">
      <Flex justify="center" align="center">
        <Result
          status="404"
          title="404"
          subTitle="Извините, страница, которую вы ищете, не найдена."
          extra={
            <Button
              type="primary"
              onClick={() => navigate({ to: '/' })}
            >
              Вернуться на главную
            </Button>
          }
        />
      </Flex>
    </div>
  );
});
