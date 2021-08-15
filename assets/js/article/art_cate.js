$(function() {
    // 想用layui的属性特效，先导入
    var layer = layui.layer
        // 想用form先导入，form是啥
    var form = layui.form

    // 调用initArtCateList
    initArtCateList()

    // 获取文章分类列表,initArtCateList自定义名字
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 添加
    // 插入内容，为了添加后让弹出自动关闭
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            // 下面这两行设置属性是为了设置属性，在layui里面找的
            type: 1,
            area: ['500px', '250px'],
            title: '文章分类',
            // 弹出框中的内容
            content: $('#dialog-add').html()
        });
    })

    // 因为是通过js遍历的方式渲染的表单，所以不能直接获取id来操作，只能代理
    // 所以就绑定在body身上， 代理到form - add
    $('body').on('submit', '#form-add', function(e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                // res是服务器相应回来的数据
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('新增分类失败！')
                    }
                    initArtCateList()
                    layer.msg('新增分类成功！')
                    layer.close(indexAdd)
                }
            })
        })
        // 编辑
        // 插入内容，为了添加后让弹出自动关闭
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章信息的层
        indexEdit = layer.open({
            // 下面这两行设置属性是为了设置属性，在layui里面找的
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            // 弹出框中的内容
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
            // 发起请求获取对应分类的数据,用来实现获取修改表单内容
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // 把获取来的 res.data给到HTML里的form-edit
                form.val('form-edit', res.data)
            }
        })

    })

    // 因为是通过js遍历的方式渲染的表单，所以不能直接获取id来操作，只能代理
    // 所以就绑定在body身上， 代理到form - add
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            // res是服务器相应回来的数据
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                layer.msg('新增分类成功！')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 删除
    // 插入内容，为了添加后让弹出自动关闭
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
            // 提示用户是否要删除,这部分模板来的，用户点击确认就会触发function
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})