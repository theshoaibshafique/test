import React from 'react';
import { shallow } from 'enzyme';

import SSTHeader from '../index';

describe('<SSTHeader />', () => {
  it('should render a div', () => {
    const renderedComponent = shallow(<SSTHeader />);
    expect(renderedComponent.length).toEqual(1);
  });
});
