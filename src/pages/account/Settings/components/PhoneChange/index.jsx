import { Card, Steps } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const { Step } = Steps;

class PhoneChange extends Component {
  getCurrentStep() {
    const { current } = this.props;

    switch (current) {
      case 'unbind':
        return 0;

      case 'bind':
        return 1;

      case 'result':
        return 2;

      default:
        return 0;
    }
  }

  render() {
    const currentStep = this.getCurrentStep();
    let stepComponent;

    if (currentStep === 1) {
      stepComponent = <Step2 />;
    } else if (currentStep === 2) {
      stepComponent = <Step3 />;
    } else {
      stepComponent = <Step1 />;
    }

    return (
        <Card bordered={false}>
          <>
            <Steps current={currentStep} >
              <Step title="解绑旧手机" />
              <Step title="绑定新手机" />
              <Step title="完成" />
            </Steps>
            {stepComponent}
          </>
        </Card>
    );
  }
}

export default connect(({ accountSettings }) => ({
  current: accountSettings.currentStep,
}))(PhoneChange);
