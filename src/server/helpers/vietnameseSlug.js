module.exports = {
  stringToSlug(str) {
    // remove accents
    const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñç';
    const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouunc';
    let re = '';
    for (let i = 0, l = from.length; i < l; i += 1) {
      re = str.replace(RegExp(from[i], 'gi'), to[i]);
    }
    return re;
  },

  starndardUploadName(str) {
    // remove accents
    const from = 'àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñç';
    const to = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouunc';
    let re = '';
    for (let i = 0, l = from.length; i < l; i += 1) {
      re = str.replace(RegExp(from[i], 'gi'), to[i]);
    }
    return re.replace(/\s/g, '-');
  }
};
