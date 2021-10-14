import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import FuzzySearch from '../index';

const { describe, it } = global;

const list = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
  },
  {
    id: 2,
    title: 'The DaVinci Code',
    author: 'Dan Brown',
  },
  {
    id: 3,
    title: 'Angels & Demons',
    author: 'Dan Brown',
  },
];

describe('<FuzzySearch />', () => {
  it('should set correct placeholder text', () => {
    const onSelect = sinon.spy();
    const wrapper = mount(
      <FuzzySearch
        onSelect={onSelect}
        keys={['author', 'title']}
        list={list}
        placeholder="testing"
      />,
    );
    const placeholder = wrapper.find('input').prop('placeholder');
    expect(placeholder).to.equal('testing');
  });

  it('should show results on typing', () => {
    const onSelect = sinon.spy();
    const wrapper = mount(
      <FuzzySearch onSelect={onSelect} keys={['author', 'title']} list={list} />,
    );

    const input = wrapper.find('input');
    expect(wrapper.state('results').length).to.equal(0);

    input.simulate('change', {
      target: {
        value: 't',
      },
    });

    expect(wrapper.state('results').length).to.not.equal(0);
  });

  it('should set results as ids if passed in options', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <FuzzySearch list={list} onSelect={onChange} keys={['author', 'title']} id="id" />,
    );

    const input = wrapper.find('input');
    input.simulate('change', {
      target: {
        value: 't',
      },
    });

    expect(wrapper.state('results')).to.eql(['1', '2']);
  });

  it('should call onChange on selection of result', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <FuzzySearch list={list} onSelect={onChange} keys={['author', 'title']} />,
    );

    const input = wrapper.find('input');
    input.simulate('change', {
      target: {
        value: 't',
      },
    });

    expect(wrapper.state('results').length).to.not.equal(0);

    const div = wrapper.find('.react-fuzzy-search');

    div.simulate('keydown', {
      keyCode: 13,
    });

    expect(onChange.calledOnce).to.equal(true);
  });

  it('should overwrite previous props with options passed in', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <FuzzySearch
        list={list}
        onSelect={onChange}
        keys={['author', 'title']}
        options={{ includeMatches: true }}
      />,
    );

    const input = wrapper.find('input');
    input.simulate('change', {
      target: {
        value: 't',
      },
    });

    // Each result should have a 'matches' array now with `includeMatches`
    expect(wrapper.state('results')[0].matches.length).to.not.equal(0);
  });

  it('should display keyForDisplayName when passed in', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <FuzzySearch
        keyForDisplayName="author"
        list={list}
        onSelect={onChange}
        keys={['author', 'title']}
        options={{ includeMatches: true }}
      />,
    );

    const input = wrapper.find('input');
    input.simulate('change', {
      target: {
        value: 'f',
      },
    });

    // Each result should have a 'matches' array now with `includeMatches`
    expect(wrapper.state('results')[0].item.title).to.equal('The Great Gatsby');
  });

  it('should support style props', () => {
     const onChange = sinon.spy();
     const wrapper = mount(
      <FuzzySearch
        list={list}
        onSelect={onChange}
        keys={['author', 'title']}
        inputStyle={{
          outline: '1px solid red',
        }}
        inputWrapperStyle={{
          outline: '1px solid red',
        }}
        resultStyle={{
          backgroundColor: 'yellow',
        }}
        listWrapperStyle={{
          border: '2px solid blue',
        }}
        selectedListItemStyle={{
          backgroundColor: 'green',
        }}
      />,
    );

    expect(wrapper.find('input')).to.exist;
  })

  it('should display all options onFocus when shouldShowDropdownAtStart passed in', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <FuzzySearch
        keyForDisplayName="author"
        list={list}
        onSelect={onChange}
        keys={['author', 'title']}
        options={{ includeMatches: true }}
        shouldShowDropdownAtStart
      />,
    );

    const input = wrapper.find('input');

    input.simulate('focus');

    expect(wrapper.state('results').length).to.not.equal(0);
  });

  it('with inputProps provided', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <FuzzySearch
        list={list}
        inputProps={{
          defaultValue: 'Hello there!',
          onChange,
        }}
        onSelect={onChange}
        keys={['author', 'title']}
        options={{ includeMatches: true }}
        defaultValue="Hello there!"
      />,
    );

    const input = wrapper.find('input');

    expect(input.get(0).value).to.equal('Hello there!');

    input.simulate('change', {
      target: {
        value: 't',
      },
    });

    expect(onChange.calledOnce).to.equal(true);
  });
});
