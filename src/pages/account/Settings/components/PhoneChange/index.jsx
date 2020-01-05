import { Card, Steps } from 'antd';
import React from 'react';
import { connect } from 'dva';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const { Step } = Steps;

const PhoneChange = ({ current }) => {
  let stepComponent;
  let stepCount;
  switch (current) {
    case 'unbind':
      stepComponent = <Step1 />;
      stepCount = 0;
      break;

    case 'bind':
      stepComponent = <Step2 />;
      stepCount = 1;
      break;

    case 'result':
      stepComponent = <Step3 />;
      stepCount = 2;
      break;

    default:
  }

  return (
    <Card bordered={false}>
      <>
        <Steps current={stepCount}>
          <Step title="解绑旧手机" />
          <Step title="绑定新手机" />
          <Step title="完成" />
        </Steps>
        {stepComponent}
      </>
    </Card>
  );
};

export default connect(({ accountSettings }) => ({
  current: accountSettings.currentStep,
}))(PhoneChange);
