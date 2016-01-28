require 'rails_helper'

describe Age, type: :model do
  it { expect(Age.new).to be_a(Age) }
  it { expect(Age.new.valid?).to be_falsey }
end
